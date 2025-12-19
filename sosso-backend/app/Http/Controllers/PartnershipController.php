<?php

namespace App\Http\Controllers;

use App\Models\Partnership;
use Illuminate\Http\Request;

class PartnershipController extends Controller
{
    /**
     * Soumettre une demande de partenariat
     */
    public function store(Request $request)
    {
        $request->validate([
            'organization_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'partnership_type' => 'required|in:educational,cultural,commercial',
            'description' => 'required|string',
        ]);

        $partnership = Partnership::create($request->all());

        return response()->json([
            'message' => 'Demande de partenariat soumise avec succès',
            'partnership' => $partnership,
        ], 201);
    }

    /**
     * Obtenir toutes les demandes de partenariat (admin uniquement)
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Partnership::class);

        $perPage = $request->get('per_page', 20);
        $status = $request->get('status');

        $query = Partnership::orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $partnerships = $query->paginate($perPage);

        return response()->json($partnerships);
    }

    /**
     * Mettre à jour le statut d'une demande (admin uniquement)
     */
    public function updateStatus(Request $request, $id)
    {
        $this->authorize('update', Partnership::class);

        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $partnership = Partnership::findOrFail($id);
        $partnership->status = $request->status;
        $partnership->save();

        return response()->json([
            'message' => 'Statut mis à jour',
            'partnership' => $partnership,
        ]);
    }
}
