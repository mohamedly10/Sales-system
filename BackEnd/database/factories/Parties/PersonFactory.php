<?php

namespace Database\Factories\Parties;

use App\Enums\Parties\PersonStatus;
use App\Models\Parties\Person;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonFactory extends Factory
{
    protected $model = Person::class;

    private static array $arabicNames = [
        'أحمد', 'محمد', 'خالد', 'علي', 'عمر', 'سعيد', 'عبدالله', 'فهد',
        'مصطفى', 'ناصر', 'إبراهيم', 'يوسف', 'حسن', 'كريم', 'طارق',
    ];

    private static array $companies = [
        'شركة الأمل', 'مؤسسة النور', 'شركة البركة', 'مؤسسة الفلاح',
        'شركة الريان', 'مؤسسة الصفا', 'شركة النجاح', 'شركة التقدم',
    ];

    public function definition(): array
    {
        return [
            'code' => $this->generateCode(),
            'name' => static::$arabicNames[array_rand(static::$arabicNames)],
            'phone' => '09' . fake()->numerify('########'),
            'company' => static::$companies[array_rand(static::$companies)] . ' ' . fake()->randomElement(['التجارية', 'المقاولات', 'للنفط', 'للخدمات']),
            'address' => fake()->randomElement(['طرابلس', 'بنغازي', 'مصراتة', 'الزاوية', 'سبها', 'الخمس', 'زليتن', 'تاجوراء']),
            'status' => fake()->randomElement(PersonStatus::values()),
            'notes' => fake()->optional(0.4)->sentence(),
        ];
    }

    private function generateCode(): string
    {
        $yearMonth = now()->format('ym');
        $last = Person::where('code', 'like', "PER-{$yearMonth}-%")
            ->max('code');

        $number = $last ? (int) substr($last, -4) + 1 : 1;

        return sprintf("PER-{$yearMonth}-%04d", $number);
    }
}
