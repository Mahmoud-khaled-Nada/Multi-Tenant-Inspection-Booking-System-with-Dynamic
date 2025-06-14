<?php

declare(strict_types=1);

namespace Modules\Auth\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LoginResponseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'user' => [
                'id' => $this->id,
                'tenant_id' => $this->tenant_id,
                'name' => $this->name,
                'email' => $this->email,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ],
            'tenant' => [
                'id' => $this->tenant->id,
                'name' => $this->tenant->name,
                'created_at' => $this->tenant->created_at,
                'updated_at' => $this->tenant->updated_at,
            ],
            'token' => $this->token,
        ];
    }
}
