from httpx import ASGITransport, AsyncClient

from src.main import app

async def test_save_playbook__when_content_is_saved_and_loaded__should_returns_the_latest_content():
    # Use case: save the playbook
    # Scenario: content is saved and then loaded
    # Expectation: the loaded document matches the latest saved content
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        put_response = await client.put("/playbook", json={"content": "My playbook"})
        get_response = await client.get("/playbook")

    assert put_response.status_code == 200
    assert get_response.status_code == 200
    assert get_response.json()["content"] == "My playbook"