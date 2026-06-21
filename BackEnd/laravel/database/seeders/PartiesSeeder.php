<?php

namespace Database\Seeders;

use App\Actions\Parties\CreatePersonAction;
use App\Enums\Parties\PersonStatus;
use App\Models\Parties\Person;
use Illuminate\Database\Seeder;

class PartiesSeeder extends Seeder
{
    private static array $persons = [
        ['name' => 'أحمد', 'phone' => '0912001001', 'company' => 'شركة الأمل التجارية', 'address' => 'طرابلس'],
        ['name' => 'خالد', 'phone' => '0913002002', 'company' => 'مؤسسة النور للنفط', 'address' => 'بنغازي'],
        ['name' => 'علي', 'phone' => '0914003003', 'company' => 'شركة البركة للخدمات', 'address' => 'مصراتة'],
        ['name' => 'عمر', 'phone' => '0915004004', 'company' => 'مؤسسة الفلاح للمقاولات', 'address' => 'الزاوية'],
        ['name' => 'سعيد', 'phone' => '0916005005', 'company' => 'شركة الريان التجارية', 'address' => 'سبها'],
        ['name' => 'مصطفى', 'phone' => '0917006006', 'company' => 'مؤسسة الصفا للخدمات', 'address' => 'الخمس'],
        ['name' => 'ناصر', 'phone' => '0918007007', 'company' => 'شركة النجاح للنفط', 'address' => 'زليتن'],
        ['name' => 'إبراهيم', 'phone' => '0919008008', 'company' => 'شركة التقدم المقاولات', 'address' => 'تاجوراء'],
    ];

    public function run(CreatePersonAction $createPerson): void
    {
        $existingCount = Person::count();
        $target = 10;

        if ($existingCount >= $target) {
            return;
        }

        $needed = $target - $existingCount;

        for ($i = 0; $i < $needed; $i++) {
            $data = static::$persons[$i];

            $createPerson->execute([
                'name' => $data['name'],
                'phone' => $data['phone'],
                'company' => $data['company'],
                'address' => $data['address'],
                'status' => PersonStatus::Active->value,
                'notes' => null,
            ]);
        }
    }
}
