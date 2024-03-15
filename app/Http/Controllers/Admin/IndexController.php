<?php
namespace App\Http\Controllers\Admin;

use App\Charts\Highcharts;
use App\Http\Controllers\AdminController;
use App\Models\Advertisement;
use App\Models\Club;
use App\Models\Event;
use App\Models\Ground;
use App\Models\Section;
use App\Models\SectionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Spatie\Analytics\Analytics;
use Spatie\Analytics\Period;

class IndexController extends AdminController
{
    public function index()
    {
        // analytics related functionality
        $storagePath = storage_path() . '/app/analytics/';
        if (File::exists($storagePath . 'service-account-credentials.json')) {
            //Last week visitors statistics
            $month_visits = Analytics::fetchTotalVisitorsAndPageViews(Period::days(7))->groupBy(
                function (array $visitorStatistics) {
                    return $visitorStatistics['date']->format('Y-m-d');
                }
            )->map(
                function ($visitorStatistics, $yearMonth) {
                    list($year, $month, $day) = explode('-', $yearMonth);
                    return ['date' => "{$year}-{$month}-{$day}", 'visitors' => $visitorStatistics->sum('visitors'), 'pageViews' => $visitorStatistics->sum('pageViews')];
                }
            )->values();

            //yearly visitors statistics
            $year_visits = Analytics::fetchTotalVisitorsAndPageViews(Period::days(365))->groupBy(
                function (array $visitorStatistics) {
                    return $visitorStatistics['date']->format('Y-m');
                }
            )->map(
                function ($visitorStatistics, $yearMonth) {
                    list($year, $month) = explode('-', $yearMonth);
                    return ['date' => "{$year}-{$month}", 'visitors' => $visitorStatistics->sum('visitors'), 'pageViews' => $visitorStatistics->sum('pageViews')];
                }
            )->values();

            // total page visitors and views
            $visitorsData = Analytics::performQuery(Period::days(7), 'ga:visitors,ga:pageviews', ['dimensions' => 'ga:date']);
            $visitorsData = collect($visitorsData['rows'] ?? [])->map(
                function (array $dateRow) {
                    return [

                        'visitors' => (int) $dateRow[1],
                        'pageViews' => (int) $dateRow[2],
                    ];
                }
            );
            $visitors = 0;
            $pageVisits = 0;
            foreach ($visitorsData as $val) {
                $visitors += $val['visitors'];
                $pageVisits += $val['pageViews'];
            }

            //user types ['returning','new']
            $userTypesCollection = Analytics::fetchUserTypes(Period::days(7));
            $userTypes = $userTypesCollection->mapWithKeys(
                function ($item, $key) {
                    return [ $key => [
                        'label' => $item['type'],
                        'value' => $item['sessions']
                    ]];
                }
            );
            $analytics_error = 0;
        } else {
            $month_visits = 0;
            $year_visits = 0;
            $visitors = 0;
            $pageVisits = 0;
            $analytics_error = 1;
            $userTypes = 0;
        }

        //user stats
        $users_data = DB::table('users')
            ->select(DB::raw('extract(month from created_at) as month'), DB::raw('count(id) as total'))
            ->whereBetween('created_at', [Carbon::parse('first day of january'), Carbon::parse('last day of december')])
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month')
            ->all();
        $users_chart = new Highcharts;
        $users_chart->labels(collect($users_data)->keys());
        $users_chart->dataset('Users By Month', 'area', collect($users_data)->values())->options(
            [
                'color' => '#00bc8c'
            ]
        );
        $grounds=Advertisement::all();
        $users=User::all();

        return view('admin.index',
            compact('analytics_error', 'users_chart', 'visitors',
                'pageVisits', 'month_visits', 'year_visits','users', 'grounds'));
    }
}
