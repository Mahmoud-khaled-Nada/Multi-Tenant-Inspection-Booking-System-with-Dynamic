<?php

declare(strict_types=1);

namespace Modules\Bookings\Tests\Feature;


use Modules\Bookings\Models\Booking;
use Modules\Tenants\Models\Tenant;
use Modules\Users\Models\User;
use Modules\Teams\Models\Team;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->user = User::factory()->create(['tenant_id' => $this->tenant->id]);
    $this->team = Team::factory()->create(['tenant_id' => $this->tenant->id]);

    Sanctum::actingAs($this->user);
});

it('allows a user to book a slot', function () {
    $response = $this->postJson('/api/v1/bookings', [
        'team_id' => $this->team->id,
        'date' => '2025-06-20',
        'start_time' => '10:00',
        'end_time' => '11:00',
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('bookings', [
        'team_id' => $this->team->id,
        'user_id' => $this->user->id,
        'date' => '2025-06-20',
        'start_time' => '10:00',
    ]);
});

it('prevents booking conflict', function () {
    Booking::create([
        'tenant_id' => $this->tenant->id,
        'user_id' => $this->user->id,
        'team_id' => $this->team->id,
        'date' => '2025-06-20',
        'start_time' => '10:00',
        'end_time' => '11:00',
    ]);

    $response = $this->postJson('/api/v1/bookings', [
        'team_id' => $this->team->id,
        'date' => '2025-06-20',
        'start_time' => '10:30',
        'end_time' => '11:30',
    ]);

    $response->assertStatus(409);
    $response->assertJson(['message' => 'Time slot already booked']);
});