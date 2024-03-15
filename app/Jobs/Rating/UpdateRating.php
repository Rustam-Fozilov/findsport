<?php

namespace App\Jobs\Rating;

use App\Models\Advertisement;
use App\Models\Infrastructure;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class UpdateRating implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    /**
     * @var array
     */
    private $ratings;

    /**
     * Create a new job instance.
     *
     * @param array $ratings
     */
    public function __construct(Collection $ratings)
    {
        $this->ratings = $ratings;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        foreach ($this->ratings as $item) {
            if($item['ratingable_type'] === Advertisement::class) {
                $food = Advertisement::query()->find($item['ratingable_id']);

                $food->update([
                    'ratings_count' => $food->ratings()->count(),
                    'ratings_avg' => round($food->ratings()->avg('star'), 1)
                ]);
            }
        }

        $vendor_id = Advertisement::query()->whereIn('id', $this->ratings->pluck('ratingable_id'))
            ->pluck('vendor_id')->first();

    }
}
