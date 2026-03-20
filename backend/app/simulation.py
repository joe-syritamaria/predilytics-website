from fastapi import APIRouter, UploadFile, File, Form
from app.services.csv_parser import parse_csv_text
from app.services.simulation_runner import run_simulation

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.post("/run")
async def run_simulation_route(
    file: UploadFile = File(...),
    prediction_interval: int = Form(100),
    event_threshold: float = Form(0.6),
    short_window_size: int = Form(20),
    long_window_size: int = Form(100),
):
    content = await file.read()
    csv_text = content.decode("utf-8")

    cycles = parse_csv_text(csv_text)
    results = run_simulation(
        cycles,
        prediction_interval=prediction_interval,
        event_threshold=event_threshold,
        short_window_size=short_window_size,
        long_window_size=long_window_size,
    )

    return {
        "total_cycles": len(cycles),
        "results": results,
    }