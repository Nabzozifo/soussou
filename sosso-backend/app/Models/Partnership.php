<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partnership extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_name',
        'contact_name',
        'email',
        'phone',
        'partnership_type',
        'description',
        'status',
    ];
}
