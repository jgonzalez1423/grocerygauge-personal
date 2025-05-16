from celery import shared_task
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .models import PriceAlert, Product, PriceHistory
from .utils import search_kroger_products, get_kroger_access_token
from django.utils import timezone
import requests
from .utils import get_kroger_access_token
import logging
from django.db import IntegrityError

logger = logging.getLogger(__name__)

@shared_task
def seed_kroger_products():
    """Run once to grab 5 items per category and prune all others."""
    categories = ["bread", "eggs", "fruits", "dairy", "meat", "vegetables"]
    kept_ids = []
    token = get_kroger_access_token()

    for cat in categories:
        url     = "https://api.kroger.com/v1/products"
        headers = {"Authorization": f"Bearer {token}"}
        params  = {
            "filter.term":       cat,
            "filter.locationId": "01400943",
            "filter.limit":       5,
        }
        resp = requests.get(url, headers=headers, params=params)
        resp.raise_for_status()

        for item in resp.json().get("data", []):
            pid   = item["productId"]
            price = item.get("items", [{}])[0] \
                        .get("price", {}) \
                        .get("regular")

            # skip any with no price or zero, so they never get seeded
            if price is None or price == 0:
                logger.warning(f"Seed skipped {pid}: price is {price!r}")
                continue

            Product.objects.update_or_create(
                product_id=pid,
                defaults={
                    "name":          item.get("description", ""),
                    "brand":         item.get("brand", ""),
                    "upc":           item.get("upc"),
                    "current_price": price,
                    "last_updated":  timezone.now(),
                    "image_url":     f"https://www.kroger.com/product/images/xlarge/front/{pid}",
                }
            )
            kept_ids.append(pid)

    # remove any product not in our selected 30
    Product.objects.exclude(product_id__in=kept_ids).delete()


@shared_task
def update_kroger_prices():
    """Runs every interval to refresh price & history for existing Products."""
    now = timezone.now()

    for prod in Product.objects.all():
        item = search_kroger_products(prod.product_id)
        if not item:
            continue  # no data at all

        price = item.get("items", [{}])[0] \
                    .get("price", {}) \
                    .get("regular")

        # skip & delete if missing or zero
        if price is None or price == 0:
            logger.warning(f"Update skipped {prod.product_id}: price is {price!r}; deleting product.")
            prod.delete()
            continue

        # update the product row
        Product.objects.filter(pk=prod.pk).update(
            current_price=price,
            last_updated=now
        )

        # record history, but guard against FK races
        try:
            PriceHistory.objects.create(
                product=prod,
                price=price,
                timestamp=now
            )
        except IntegrityError as e:
            logger.warning(f"Could not create PriceHistory for {prod.product_id}: {e}")

@shared_task
def check_price_alerts():
    """Periodically checks all active price alerts and sends email via SendGrid if the product's price is below the target."""
    alerts = PriceAlert.objects.filter(is_active=True)
    for alert in alerts:
        product = alert.product
        if product.current_price is not None and product.current_price <= alert.target_price:
            message = Mail(
                from_email=settings.DEFAULT_FROM_EMAIL,  # Verified sender in SendGrid
                to_emails=alert.email,
                subject=f"Price Drop Alert: {product.name}",
                html_content=(
                    f"<p>The price for <strong>{product.name}</strong> "
                    f"has dropped to <strong>${product.current_price:.2f}</strong>, "
                    f"which is your target or below your target of <strong>${alert.target_price:.2f}</strong>!</p>"
                ),
            )

            try:
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                response = sg.send(message)
                print(f" Email sent to {alert.email} - Status {response.status_code}")

                # Optionally deactivate alert after sending
                alert.is_active = False
                alert.save()

            except Exception as e:
                print(f" Failed to send email to {alert.email}: {e}")