<?php

namespace App\Models\Parties;

use App\Models\Finance\Export;
use App\Models\Finance\Import;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'phone',
        'company',
        'address',
        'status',
        'notes',
    ];

    public function exports(): HasMany
    {
        return $this->hasMany(Export::class);
    }

    public function imports(): HasMany
    {
        return $this->hasMany(Import::class);
    }
}
