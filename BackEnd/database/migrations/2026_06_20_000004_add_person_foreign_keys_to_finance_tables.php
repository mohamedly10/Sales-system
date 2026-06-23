<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exports', function (Blueprint $table) {
            $table->foreign('person_id')->references('id')->on('persons');
        });

        Schema::table('imports', function (Blueprint $table) {
            $table->foreign('person_id')->references('id')->on('persons');
        });
    }

    public function down(): void
    {
        Schema::table('exports', function (Blueprint $table) {
            $table->dropForeign(['person_id']);
        });

        Schema::table('imports', function (Blueprint $table) {
            $table->dropForeign(['person_id']);
        });
    }
};
