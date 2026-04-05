from httpx import ASGITransport, AsyncClient

from src.main import app


async def test_create_retro__when_same_date_is_posted_twice__should_reject_second_create(api_client: AsyncClient):
    # Use case: create a daily retro
    # Scenario: the same date is posted twice
    # Expectation: the first request succeeds and the second create is rejected
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        first_response = await client.post(
            "/retros",
            json={"date": "2026-04-05", "content": "First retro"},
        )
        second_response = await client.post(
            "/retros",
            json={"date": "2026-04-05", "content": "Duplicate retro"},
        )

    assert first_response.status_code == 200
    assert first_response.json()["reward"]["granted"] is True
    assert second_response.status_code == 400


async def test_list_retros__when_limit_is_smaller_than_total_items__should_returns_paginated_page():
    # Use case: list retros
    # Scenario: more retros exist than the requested page size
    # Expectation: the API returns the newest page and a next cursor
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        await client.post("/retros", json={"date": "2026-04-03", "content": "retro 1"})
        await client.post("/retros", json={"date": "2026-04-04", "content": "retro 2"})
        await client.post("/retros", json={"date": "2026-04-05", "content": "retro 3"})

        response = await client.get("/retros", params={"limit": 2})

    body = response.json()

    assert response.status_code == 200
    assert len(body["items"]) == 2
    assert body["has_more"] is True
    assert body["next_cursor"] is not None
    assert body["items"][0]["date"] == "2026-04-05"


async def test_get_retro__when_existing_retro_id_is_requested__should_return_the_matching_item():
    # Use case: get a single retro
    # Scenario: an existing retro id is requested
    # Expectation: the API returns the stored retro
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        create_response = await client.post(
            "/retros",
            json={"date": "2026-04-05", "content": "original"},
        )
        retro_id = create_response.json()["item"]["id"]

        get_response = await client.get(f"/retros/{retro_id}")

    body = get_response.json()

    assert get_response.status_code == 200
    assert body["id"] == retro_id
    assert body["content"] == "original"


async def test_update_retro__when_existing_retro_is_updated__should_persists_the_new_content():
    # Use case: update a single retro
    # Scenario: an existing retro is updated with new content
    # Expectation: the updated response returns the new content
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        create_response = await client.post(
            "/retros",
            json={"date": "2026-04-05", "content": "original"},
        )
        retro_id = create_response.json()["item"]["id"]

        update_response = await client.put(
            f"/retros/{retro_id}",
            json={"content": "updated"},
        )

    body = update_response.json()

    assert update_response.status_code == 200
    assert body["id"] == retro_id
    assert body["content"] == "updated"