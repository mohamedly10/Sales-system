<?php

namespace Database\Factories\Finance;

use App\Models\Finance\Import;
use App\Models\Parties\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class ImportFactory extends Factory
{
    protected $model = Import::class;

    private static array $reasons = [
        'دفعة مبيعات', 'تحصيل مستحقات', 'دفعة مقدمة', 'إيراد خدمات',
        'عوائد استثمار', 'تعويضات', 'منحة', 'إيجار', 'دفعة تأمين',
    ];

    public function definition(): array
    {
        return [
            'code' => $this->generateCode(),
            'person_id' => Person::inRandomOrder()->first()?->id ?? 1,
            'amount' => fake()->randomFloat(2, 500, 50000),
            'reason' => static::$reasons[array_rand(static::$reasons)],
            'note' => fake()->optional(0.5)->sentence(),
            'date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
        ];
    }

    private function generateCode(): string
    {
        $yearMonth = now()->format('ym');
        $last = Import::where('code', 'like', "IMP-{$yearMonth}-%")
            ->max('code');

        $number = $last ? (int) substr($last, -4) + 1 : 1;

        return sprintf("IMP-{$yearMonth}-%04d", $number);
    }
}
