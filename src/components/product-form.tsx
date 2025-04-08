"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import React, { useState } from "react"

// Interfaces
interface Product {
  id: string
  status: "available" | "in_use" | "maintenance" | "lost"
  category: "computing" | "network" | "peripherals" | "printing" | "monitoring" | "audio_video"
  model: string
  brand: string
  partNumber: string
  serialNumber: string
  location: string
  responsible: string
  acquisitionDate: Date
  warrantyLimit: Date
  interventions: any[]
  companyId?: string
  delegationId?: string
  branchId?: string
  acquisitionMonth?: string
  acquisitionYear?: string
  department?: string
  companyName?: string
  delegationName?: string
  branchName?: string
}

// Mapeamentos
const statusMap = {
  available: { label: "Disponível", color: "text-green-600" },
  in_use: { label: "Em uso", color: "text-blue-600" },
  maintenance: { label: "Manutenção", color: "text-yellow-600" },
  lost: { label: "Extraviado", color: "text-red-600" },
}

const categoryMap = {
  computing: "Computação",
  network: "Rede",
  peripherals: "Periféricos",
  printing: "Impressão",
  monitoring: "Monitoramento",
  audio_video: "Áudio e Vídeo",
}

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id" | "interventions" | "companyId" | "delegationId" | "branchId">) => void
  onCancel: () => void
}

const ProductForm = React.memo(({ onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<
    Omit<Product, "id" | "interventions" | "companyId" | "delegationId" | "branchId">
  >({
    status: "available",
    category: "computing",
    model: "",
    brand: "",
    partNumber: "",
    serialNumber: "",
    location: "",
    responsible: "",
    acquisitionDate: new Date(),
    warrantyLimit: new Date(),
    department: "",
    companyName: "",
    delegationName: "",
    branchName: "",
  })

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => updateField("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusMap).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={formData.category} onValueChange={(value: any) => updateField("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryMap).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Modelo</Label>
          <Input value={formData.model} onChange={(e) => updateField("model", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Marca</Label>
          <Input value={formData.brand} onChange={(e) => updateField("brand", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Part Number</Label>
          <Input value={formData.partNumber} onChange={(e) => updateField("partNumber", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Serial Number</Label>
          <Input value={formData.serialNumber} onChange={(e) => updateField("serialNumber", e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Localização</Label>
        <Input value={formData.location} onChange={(e) => updateField("location", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Responsável</Label>
        <Input value={formData.responsible} onChange={(e) => updateField("responsible", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Departamento</Label>
        <Input value={formData.department} onChange={(e) => updateField("department", e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Empresa</Label>
          <Input value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Delegação</Label>
          <Input value={formData.delegationName} onChange={(e) => updateField("delegationName", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Filial</Label>
          <Input value={formData.branchName} onChange={(e) => updateField("branchName", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Aquisição</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.acquisitionDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.acquisitionDate ? (
                  format(formData.acquisitionDate, "dd/MM/yyyy")
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.acquisitionDate}
                onSelect={(date) => updateField("acquisitionDate", date || new Date())}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>Limite da Garantia</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.warrantyLimit && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.warrantyLimit ? format(formData.warrantyLimit, "dd/MM/yyyy") : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.warrantyLimit}
                onSelect={(date) => updateField("warrantyLimit", date || new Date())}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Adicionar</Button>
      </div>
    </div>
  )
})

ProductForm.displayName = "ProductForm"

export default ProductForm
