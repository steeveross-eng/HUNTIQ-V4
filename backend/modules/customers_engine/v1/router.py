"""Customers Engine Router"""
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from .models import Customer, CustomerCreate, CustomerUpdate
from .service import get_customers_service

router = APIRouter(prefix="/api/v1/customers", tags=["Customers Engine"])

class HealthResponse(BaseModel):
    status: str
    engine: str
    version: str
    message: str

@router.get("/health", response_model=HealthResponse)
async def health_check():
    service = get_customers_service()
    stats = await service.get_stats()
    return HealthResponse(
        status="operational", engine="customers_engine", version="1.0.0",
        message=f"Engine opérationnel - {stats['total_customers']} clients"
    )

@router.get("/stats")
async def get_stats():
    service = get_customers_service()
    return await service.get_stats()

@router.get("/", response_model=List[Customer])
async def get_customers():
    service = get_customers_service()
    return await service.get_all()

@router.get("/{customer_id}", response_model=Customer)
async def get_customer(customer_id: str):
    service = get_customers_service()
    customer = await service.get_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return customer

@router.get("/session/{session_id}", response_model=Customer)
async def get_customer_by_session(session_id: str):
    service = get_customers_service()
    customer = await service.get_by_session(session_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return customer

@router.post("/", response_model=Customer)
async def create_customer(customer_input: CustomerCreate):
    service = get_customers_service()
    return await service.create(customer_input)

@router.put("/{customer_id}", response_model=Customer)
async def update_customer(customer_id: str, update_data: CustomerUpdate):
    service = get_customers_service()
    customer = await service.update(customer_id, update_data)
    if not customer:
        raise HTTPException(status_code=404, detail="Client non trouvé")
    return customer
