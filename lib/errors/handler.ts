import { NextResponse } from 'next/server'

export class SofIAError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message)
    this.name = 'SofIAError'
    Object.setPrototypeOf(this, SofIAError.prototype)
  }
}

export class ValidationError extends SofIAError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class DatabaseError extends SofIAError {
  constructor(message: string) {
    super(message, 500, false)
    this.name = 'DatabaseError'
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}

export type ErrorResponse = {
  error: string
  code?: string
  details?: unknown
}

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  const isProd = process.env.NODE_ENV === 'production'
  const details = error instanceof Error ? error.message : String(error)
  
  if (!isProd) {
    console.error('[SofIA Error Full]:', error)
  } else {
    console.error('[SofIA Error]:', details, error instanceof Error ? error.stack : undefined)
  }

  if (error instanceof SofIAError) {
    return NextResponse.json(
      {
        error: error.isOperational ? error.message : 'Erro interno do servidor',
        code: error.name,
        details: isProd ? undefined : details,
      },
      { status: error.statusCode },
    )
  }

  return NextResponse.json(
    { 
      error: 'Erro interno do servidor', 
      code: 'INTERNAL_ERROR',
      details: isProd ? undefined : details,
    },
    { status: 500 },
  )
}
