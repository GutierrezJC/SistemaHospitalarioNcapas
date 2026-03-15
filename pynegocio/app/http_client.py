import httpx

DATOS_BASE_URL = "http://webdatos/api"


async def call_datos(
    endpoint: str,
    method: str,
    body: bytes | None = None,
    headers: dict | None = None,
) -> tuple[int, bytes]:
    """
    Forwards a request to the pydatos API.
    Mirrors ServicioCURL.php — sends raw bytes to preserve Content-Type.
    """
    forward_headers = {"Content-Type": "application/json"}
    if headers:
        forward_headers.update(headers)

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=method,
            url=DATOS_BASE_URL + endpoint,
            content=body,
            headers=forward_headers,
            timeout=30.0,
        )
    return response.status_code, response.content
