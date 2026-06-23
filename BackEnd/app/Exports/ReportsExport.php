<?php

namespace App\Exports;

use App\Models\Finance\Export;
use App\Models\Finance\Import;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ReportsExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $type = $this->request->input('type', 'all');
        $dateFrom = $this->request->input('date_from');
        $dateTo = $this->request->input('date_to');
        $personId = $this->request->input('person_id');
        $search = $this->request->input('search');

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
                    'person' => $export->person?->name ?? 'غير محدد',
                    'desc' => $export->reason . ($export->note ? ' | ' . $export->note : ''),
                    'type' => 'صادر',
                    'amount' => (float) $export->amount * -1,
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
                    'person' => $import->person?->name ?? 'غير محدد',
                    'desc' => $import->reason . ($import->note ? ' | ' . $import->note : ''),
                    'type' => 'وارد',
                    'amount' => (float) $import->amount,
                ];
            }));
        }

        return $items->sortByDesc(fn($item) => $item['id'])->values();
    }

    public function headings(): array
    {
        return [
            'كود المرجع',
            'التاريخ',
            'اسم الشخص',
            'البيان / الوصف',
            'نوع المعاملة',
            'المبلغ (د.ل)',
        ];
    }

    public function map($row): array
    {
        return [
            $row['id'],
            $row['date'],
            $row['person'],
            $row['desc'],
            $row['type'],
            number_format($row['amount'], 2),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->setRightToLeft(true);

        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'ffffff']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '1e293b'],
                ],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }
}
