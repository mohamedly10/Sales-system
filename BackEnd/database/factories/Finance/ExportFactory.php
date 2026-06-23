<?php

namespace Database\Factories\Finance;

use App\Models\Finance\Export;
use App\Models\Parties\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExportFactory extends Factory
{
    protected $model = Export::class;

    private static array $reasons = [
        'مصروفات تشغيلية', 'رواتب', 'صيانة', 'مشتريات', 'فواتير كهرباء',
        'إيجار مقر', 'مصروفات نقل', 'تجهيزات مكتبية', 'مصروفات تسويق',
    ];

    public function definition(): array
    {
        return [
            'code' => $this->generateCode(),
            'person_id' => Person::inRandomOrder()->first()?->id ?? 1,
            'amount' => fake()->randomFloat(2, 100, 30000),
            'reason' => static::$reasons[array_rand(static::$reasons)],
            'note' => fake()->optional(0.5)->sentence(),
            'date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
        ];
    }

    private function generateCode(): string
    {
        $yearMonth = now()->format('ym');
        $last = Export::where('code', 'like', "EXP-{$yearMonth}-%")
            ->max('code');

        $number = $last ? (int) substr($last, -4) + 1 : 1;

        return sprintf("EXP-{$yearMonth}-%04d", $number);
    }
}
