<?php

namespace Database\Seeders;

use App\Models\Finance\Export;
use App\Models\Finance\Import;
use App\Models\Parties\Person;
use Illuminate\Database\Seeder;

class FinanceSeeder extends Seeder
{
    public function run(): void
    {
        $persons = Person::all();

        foreach ($persons as $person) {
            for ($i = 0; $i < 5; $i++) {
                Import::factory()->create([
                    'person_id' => $person->id,
                    'date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
                ]);

                Export::factory()->create([
                    'person_id' => $person->id,
                    'date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
                ]);
            }
        }
    }
}
