import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'

import { inventoryService } from '@/services/inventory'
import type { ProductQueryParams } from '@/services/inventory/inventory.service'
import type { InventoryProductPayload } from '@/api/types/inventory'

const getErrorMessage = (error: AxiosError<any>) => {
  const data = error.response?.data
  if (data) {
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
  }
  return 'Ocurrió un error en inventario.'
}

export const useProductsQuery = (params: ProductQueryParams = {}) =>
  useQuery({
    queryKey: ['inventory', 'products', params],
    queryFn: () => inventoryService.listProducts(params),
    retry: 1,
  })

export const useProductDetailQuery = (id?: string) =>
  useQuery({
    queryKey: ['inventory', 'product', id],
    queryFn: () => inventoryService.productDetail(id!),
    enabled: Boolean(id),
  })

export const useProductCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InventoryProductPayload) => inventoryService.createProduct(payload),
    onSuccess: () => {
      toast.success('Producto registrado')
      queryClient.invalidateQueries({ queryKey: ['inventory', 'products'] })
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useProductUpdateMutation = (id: number | string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InventoryProductPayload) => inventoryService.updateProduct(id, payload),
    onSuccess: () => {
      toast.success('Producto actualizado')
      queryClient.invalidateQueries({ queryKey: ['inventory', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['inventory', 'product', String(id)] })
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useProductDeactivateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => inventoryService.deactivateProduct(id),
    onSuccess: () => {
      toast.success('Producto desactivado')
      queryClient.invalidateQueries({ queryKey: ['inventory', 'products'] })
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ['inventory', 'categories'],
    queryFn: inventoryService.listCategories,
    staleTime: 10 * 60 * 1000,
  })

export const useBrandsQuery = () =>
  useQuery({
    queryKey: ['inventory', 'brands'],
    queryFn: inventoryService.listBrands,
    staleTime: 10 * 60 * 1000,
  })

export const useKardexQuery = (buscador?: string) =>
  useQuery({
    queryKey: ['inventory', 'kardex', buscador],
    queryFn: () => inventoryService.listKardex(buscador),
  })

