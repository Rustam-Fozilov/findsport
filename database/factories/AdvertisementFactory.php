<?php

namespace Database\Factories;


use App\Models\Advertisement;
use App\Models\Degree;
use App\Models\Infrastructure;
use App\Models\Sport;
use App\Services\Advertisement\AdvertisementService;
use App\Services\Media\MediaService;
use Exception;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class AdvertisementFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Advertisement::class;

    /**
     * @throws Exception
     */
    public function configure()
    {
        $fake = $this->faker;

        ini_set('max_execution_time', 500);
        return $this->afterCreating(static function (Advertisement $advertisement) use ($fake) {
            $service = new AdvertisementService(new MediaService());
            $attributes = [];
            $medias=[];
            $disk = Storage::build([
                'driver' => 'local',
                'root' => storage_path("app/public/uploads/temp/"),
            ]);
            $disk->delete($disk->allFiles());
            // @mkdir(public_path('/uploads/advertisements/'), 0777, true);
            for($i=0;$i<4;$i++) {
                $time = time() . random_int(1000, 60000);
                //$fake->imageUrl(640, 480, 'sport')
                copy("https://loremflickr.com/640/480/sport", storage_path("app/public/uploads/temp/") . $time . '.jpg');
                $medias[] = $time . '.jpg';
            }
            $attributes['medias'] = $medias;
            $attributes['sports'] = $fake->randomElements(Sport::all()->pluck('id')->toArray(),4);
            $phone = [];
            for ($i = 1; $i <= random_int(1,4); $i++) {
                $phone [] = [
                    "name" => $fake->name,
                    "phone" => $fake->phoneNumber
                ];
            }
            $prices = [];
            for ($i = 1; $i <= random_int(1,4); $i++) {
                $prices [] = [
                    "description" => $fake->title,
                    "price" => random_int(50_000, 250_000)
                ];
            }
            $attributes['phones'] = $phone;
            $attributes['infrastructure'] = $fake->randomElements(Infrastructure::all()->pluck('id')->toArray(),5);
            $attributes['area'] = rand(10, 100) . 'x' . rand(10, 100) . 'x' . rand(10, 100);
            $attributes['age_begin'] = random_int(5, 20);
            $attributes['age_end'] = random_int($attributes['age_begin'], 60);
            $advertisement->sports()->sync($attributes['sports']);
            $attributes['degree'] = Degree::all()->random()->id;
            $attributes['prices'] = $prices;
            $attributes['season']=random_int(0,1);
            $attributes['trainer']=[
                "name" =>$fake->name,
                "description"=>$fake->text(100)
            ];
            $service->insertPhone($attributes, $advertisement);
            $service->insertMedia($attributes,$advertisement);
            switch ($advertisement->ad_type) {
                case 'ground':
                    $service->insertGround($attributes, $advertisement);
                    break;
                case 'section':
                    $service->insertSection($attributes, $advertisement);
                    break;
            }
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title_uz' => $this->faker->unique()->word,
            'title_ru' => $this->faker->unique()->word,
            'title_en' => $this->faker->unique()->word,
            'description_uz' => $this->faker->text,
            'description_ru' => $this->faker->text,
            'description_en' => $this->faker->text,
            'ad_type' => $this->faker->randomElement(['club', 'ground', 'section']),
            'plan_id' => $this->faker->randomElement([null, 1]),
            'location' => [
                'latitude' => $this->faker->latitude,
                'longitude' => $this->faker->longitude
            ],
            'landmark' => $this->faker->address,
            'price' => random_int(50_000, 250_000),
            'slug' => $this->faker->slug
            // 'district_id' => $this->faker->numberBetween(15, 20),


        ];
    }
}
