# Nimbus-GO Tracking-API

The NimbusGO Tracking API allows authenticated customers to retrieve the current delivery status and tracking information of a shipment.

The tracking information includes:

- Order ID
- Current order status
- Current checkpoint
- Transit details
- Checkpoint history
- Timestamp of tracking updates

### Endpoint

To get details for orders use the following route with get request (COMPLETE URL)

## GET: [http://nimbusgo-bck.vercel.app/api/v1/tracking/:orderId](https://nimbusgo-bck.vercel.app/api/v1/tracking/:orderId)

## Path parameter

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `orderId` | String/UUID | Yes | Unique identifier of the shipment/order |
|  |  |  |  |

### Example

```
GET /api/v1/tracking/ORD123456
```

## Authentication

The public tracking API does **not use customer JWT authentication**.

Instead, the endpoint is protected using an **API key**.

The request must contain the API key expected by the `apiKeyAuthentication` middleware.

```
x-api-key: <API_KEY>
```

The API key should be kept secure and must not be exposed unnecessarily in publicly distributed applications.

# Request

The tracking API does not require a request body.

### Headers

```
x-api-key: <API_KEY>
Content-Type: application/json
```

### Example Request

```
GET /api/v1/tracking/ORD123456
x-api-key: <API_KEY>
```

# Successful Response

The controller responsible for processing the request is:

```
publicTrackingController.trackOrderPublic
```

A successful response should contain the publicly available tracking information for the requested order.

Example structure:

```
{
  "success": true,
  "order": {
    "orderId": "ORD123456",
    "status": "IN_TRANSIT",
    "currentCheckpoint": {
      "id": 3,
      "name": "Hub A",
      "latitude": xx.xxxxx,
      "longitude": yy.yyyy
    },
    "transitDetail": [
      {
        "checkpoint": "Hub B",
        "status": "COMPLETED",
        "timestamp": "2026-10-05T10:30:00Z"
      },
      {
        "checkpoint": "Hub A",
        "status": "CURRENT",
        "timestamp": "2026-10-06T15:20:00Z"
      }
    ]
  }
}
```

# Tracking Status

Possible order statuses include:

| Status | Description |
| --- | --- |
| `PROCESSING` | Order is being processed |
| `ACCEPTED` | Order has been accepted |
| `IN_TRANSIT` | Shipment is currently in transit |
| `FAILED` | Shipment processing/delivery failed |
| `REJECTED` | Order was rejected |

# Current Checkpoint

The current checkpoint represents the latest known location of the shipment.

Example:

```
{
  "id": 3,
  "name": "Hub A",
  "latitude": xx.xxxx,
  "longitude": yy.yyyy
}
```

The frontend can use the coordinates to display the shipment location on a map.

# Frontend Usage

The public tracking page can call the API using:

```
const response = await fetch(
    `${API_URL}/api/v1/tracking/${orderId}`,
    {
        method: "GET",
        headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        }
    }
);

const data = await response.json();
```

The returned tracking information can then be displayed on the public tracking page.

# Error Responses

## 401 — Invalid API Key

Returned when the API key is missing or invalid.

```
{
  "success": false,
  "message": "Invalid API key"
}
```

---

## 404 — Order Not Found

Returned when the provided order ID does not exist.

```
{
  "success": false,
  "message": "Order not found"
}
```

---

## 429 — Rate Limit Exceeded

Returned when the API key exceeds the allowed request limit.

```
{
  "success": false,
  "message": "Too many requests"
}
```

---

## 500 — Internal Server Error

Returned when an unexpected server-side error occurs.

```
{
  "success": false,
  "message": "Internal server error"
}
```