export interface ClientResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  salary: number;
  companyValue: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListResponse {
  data: ClientResponse[];
  total: number;
}

export interface CreateClientRequest {
  name: string;
  salary: number;
  companyValue: number;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}
