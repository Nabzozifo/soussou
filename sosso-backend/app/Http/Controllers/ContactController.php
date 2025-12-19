<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Partnership;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Créer un nouveau message de contact
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'user_id' => $request->user()->id ?? null,
        ]);

        return response()->json([
            'message' => 'Message envoyé avec succès',
            'contact' => $contact,
        ], 201);
    }

    /**
     * Obtenir tous les messages (admin uniquement)
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Contact::class);

        $perPage = $request->get('per_page', 20);
        $status = $request->get('status');

        $query = Contact::with('user')->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $contacts = $query->paginate($perPage);

        return response()->json($contacts);
    }

    /**
     * Marquer un message comme lu (admin uniquement)
     */
    public function markAsRead(Request $request, $id)
    {
        $this->authorize('update', Contact::class);

        $contact = Contact::findOrFail($id);
        $contact->status = 'read';
        $contact->save();

        return response()->json([
            'message' => 'Message marqué comme lu',
            'contact' => $contact,
        ]);
    }

    /**
     * Supprimer un message (admin uniquement)
     */
    public function destroy(Request $request, $id)
    {
        $this->authorize('delete', Contact::class);

        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'message' => 'Message supprimé',
        ]);
    }
}
