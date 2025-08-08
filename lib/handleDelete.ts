import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

export async function handleDelete({
  entity,
  uuid,
  endpoint,
  onSuccess,
  onError,
  confirmMessage,
}: {
  entity: string
  uuid: string
  endpoint: string
  onSuccess?: () => void
  onError?: () => void
  confirmMessage?: string
}) {
  const message = confirmMessage || `Are you sure you want to delete this ${entity}?`
  if (!window.confirm(message)) return

  try {
    await apiClient.delete(`${endpoint}/${uuid}`)
    toast({
      title: "Success",
      description: `${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully`,
    })
    if (onSuccess) onSuccess()
    else window.location.reload()
  } catch (error) {
    toast({
      title: "Error",
      description: `Failed to delete ${entity}`,
      variant: "destructive",
    })
    if (onError) onError()
  }
}
