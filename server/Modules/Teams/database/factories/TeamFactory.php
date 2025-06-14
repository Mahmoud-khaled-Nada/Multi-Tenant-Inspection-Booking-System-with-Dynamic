<?php

namespace Modules\Teams\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Tenants\Models\Tenant;


class TeamFactory extends Factory
{

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'      => $this->faker->company,
            'tenant_id' => Tenant::factory(),
        ];
    }
}
