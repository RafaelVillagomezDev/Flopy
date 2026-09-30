import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'

// Hooks de RDUX TOOLKIT
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()