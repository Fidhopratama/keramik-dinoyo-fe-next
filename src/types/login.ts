export type LoginResponse = {
  data?: {
    token?: string
    user?: {
      id: number | string
      name?: string
      email?: string
    }
  }
  message?: string
}

export type LoginErrorResponse = {
  response?: {
    data?: {
      message?: string
    }
  }
}
