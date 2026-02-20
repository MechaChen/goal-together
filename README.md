# goal-together

Frontend setup:

```bash
cd frontend
pnpm install
pnpm dev
```

Backend setup:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m <backend_entrypoint>
```

Development stack baseline:
- Frontend: TypeScript + Vite + pnpm
- Backend: Python + asyncio
