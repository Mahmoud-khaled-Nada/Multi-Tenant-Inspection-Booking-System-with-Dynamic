<?php

declare(strict_types=1);

namespace Modules\Teams\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TeamsResponseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'tenant_id'   => $this->tenant_id,
            'name'        => $this->name,
            'description' => $this->description,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
            'members'     => $this->tenants->map(function ($tenant) {
                return [
                    'id'         => $tenant->id,
                    'name'       => $tenant->name,
                    'domain'     => $tenant->domain,
                    'user_id'  => $tenant->users->id,
                    'user_name'  => $tenant->users->name,
                    'user_email'  => $tenant->users->email,
                    'user_role'  => $tenant->users->role,
                    'created_at' => $tenant->created_at,
                    'updated_at' => $tenant->updated_at,
                ];
            }),
        ];
    }
}
