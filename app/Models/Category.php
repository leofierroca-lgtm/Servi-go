<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'label', 'icon'];
    public $timestamps = false;

    public function businesses()
    {
        return $this->hasMany(Business::class);
    }
}
