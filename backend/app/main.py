from fastapi import FastAPI

app = FastAPI(
    title="Clutch API",
    description="Developer activity dashboard — connecting you to your coding pulse.",
    version="0.1.0",
)


@app.get("/")
def root():
    return {"message": "Clutch API is live 🚀", "version": "0.1.0"}


@app.get("/health")
def health():
    return {"status": "ok"}