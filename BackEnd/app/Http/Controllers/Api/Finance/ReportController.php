<?php

namespace App\Http\Controllers\Api\Finance;

use App\Exports\ReportsExport;
use App\Http\Controllers\Controller;
use App\Models\Finance\Export;
use App\Models\Finance\Import;
use App\Models\Parties\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'all');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $personId = $request->input('person_id');
        $search = $request->input('search');

        $items = collect();

        if (in_array($type, ['all', 'exports'])) {
            $query = Export::with('person');

            if ($dateFrom) $query->where('date', '>=', $dateFrom);
            if ($dateTo) $query->where('date', '<=', $dateTo);
            if ($personId) $query->where('person_id', $personId);
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                      ->orWhere('reason', 'like', "%{$search}%")
                      ->orWhere('amount', 'like', "%{$search}%")
                      ->orWhereHas('person', fn($p) => $p->where('name', 'like', "%{$search}%"));
                });
            }

            $items = $items->concat($query->get()->map(function ($export) {
                return [
                    'id' => $export->code,
                    'date' => $export->date->format('Y-m-d'),
                    'name' => 'صادر - ' . ($export->person?->name ?? 'غير محدد'),
                    'amount' => (float) $export->amount * -1,
                    'desc' => $export->reason . ($export->note ? ' | ' . $export->note : ''),
                    'type' => 'export',
                ];
            }));
        }

        if (in_array($type, ['all', 'imports'])) {
            $query = Import::with('person');

            if ($dateFrom) $query->where('date', '>=', $dateFrom);
            if ($dateTo) $query->where('date', '<=', $dateTo);
            if ($personId) $query->where('person_id', $personId);
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                      ->orWhere('reason', 'like', "%{$search}%")
                      ->orWhere('amount', 'like', "%{$search}%")
                      ->orWhereHas('person', fn($p) => $p->where('name', 'like', "%{$search}%"));
                });
            }

            $items = $items->concat($query->get()->map(function ($import) {
                return [
                    'id' => $import->code,
                    'date' => $import->date->format('Y-m-d'),
                    'name' => 'وارد - ' . ($import->person?->name ?? 'غير محدد'),
                    'amount' => (float) $import->amount,
                    'desc' => $import->reason . ($import->note ? ' | ' . $import->note : ''),
                    'type' => 'import',
                ];
            }));
        }

        $sorted = $items->sortByDesc(function ($item) {
            preg_match('/(\d{4})-(\d{2})-(\d{2})/', $item['id'], $matches);
            return $matches[0] ?? $item['id'];
        })->values();

        return response()->json([
            'data' => $sorted,
            'summary' => [
                'total_amount' => $sorted->sum('amount'),
                'total_count' => $sorted->count(),
            ],
        ]);
    }

    public function persons()
    {
        return response()->json([
            'data' => Person::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function export(Request $request)
    {
        return Excel::download(
            new ReportsExport($request),
            'تقرير-حركة-الصادر-والوارد.xlsx'
        );
    }

    public function stats()
    {
        $totalPersons = Person::count();
        $totalExports = Export::count();
        $totalExportsAmount = (float) Export::sum('amount');
        $totalImports = Import::count();
        $totalImportsAmount = (float) Import::sum('amount');
        $todayOperations = Export::whereDate('date', today())->count()
                         + Import::whereDate('date', today())->count();

        return response()->json([
            'total_persons' => $totalPersons,
            'total_exports' => $totalExports,
            'total_exports_amount' => $totalExportsAmount,
            'total_imports' => $totalImports,
            'total_imports_amount' => $totalImportsAmount,
            'balance' => $totalImportsAmount - $totalExportsAmount,
            'today_operations' => $todayOperations,
        ]);
    }
}
