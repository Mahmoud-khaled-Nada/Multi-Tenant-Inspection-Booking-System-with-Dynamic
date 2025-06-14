<?php

namespace Modules\Tenants\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Tenants\Models\Tenant;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        // Tenant::factory()->count(10)->create();
        $data = [
            [
                'name' => 'Tenant 1',
                'domain' => 'tenant1',
            ],
            [
                'name' => 'Tenant 2',
                'domain' => 'tenant2',
            ],
            [
                'name' => 'Tenant 3',
                'domain' => 'tenant3',
            ],
            [
                'name' => 'Tenant 4',
                'domain' => 'tenant4',
            ],
            [
                'name' => 'Tenant 5',
                'domain' => 'tenant5',
            ],
        ];

        foreach ($data as $key => $value) {
            Tenant::create($value);
        }
    }
}
