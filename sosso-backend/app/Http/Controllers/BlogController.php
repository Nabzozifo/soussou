<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Obtenir tous les articles publiés
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $category = $request->get('category');

        $query = BlogPost::with('author:id,name')
            ->where('published', true)
            ->orderBy('published_at', 'desc');

        if ($category) {
            $query->where('category', $category);
        }

        $posts = $query->paginate($perPage);

        return response()->json($posts);
    }

    /**
     * Obtenir un article spécifique
     */
    public function show(Request $request, $id)
    {
        $post = BlogPost::with('author:id,name')->findOrFail($id);

        if (!$post->published && (!$request->user() || !$request->user()->is_admin)) {
            abort(404);
        }

        // Incrémenter les vues
        $post->incrementViews();

        return response()->json($post);
    }

    /**
     * Créer un article (admin uniquement)
     */
    public function store(Request $request)
    {
        $this->authorize('create', BlogPost::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:history,did-you-know,discoveries',
            'image_url' => 'nullable|url',
            'published' => 'boolean',
        ]);

        $post = BlogPost::create([
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
            'image_url' => $request->image_url,
            'author_id' => $request->user()->id,
            'published' => $request->published ?? false,
            'published_at' => $request->published ? now() : null,
        ]);

        return response()->json([
            'message' => 'Article créé avec succès',
            'post' => $post,
        ], 201);
    }

    /**
     * Mettre à jour un article (admin uniquement)
     */
    public function update(Request $request, $id)
    {
        $this->authorize('update', BlogPost::class);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'category' => 'sometimes|in:history,did-you-know,discoveries',
            'image_url' => 'nullable|url',
            'published' => 'boolean',
        ]);

        $post = BlogPost::findOrFail($id);

        $data = $request->only(['title', 'content', 'category', 'image_url', 'published']);

        if ($request->has('published') && $request->published && !$post->published) {
            $data['published_at'] = now();
        }

        $post->update($data);

        return response()->json([
            'message' => 'Article mis à jour',
            'post' => $post,
        ]);
    }

    /**
     * Supprimer un article (admin uniquement)
     */
    public function destroy(Request $request, $id)
    {
        $this->authorize('delete', BlogPost::class);

        $post = BlogPost::findOrFail($id);
        $post->delete();

        return response()->json([
            'message' => 'Article supprimé',
        ]);
    }

    /**
     * Obtenir les articles par catégorie
     */
    public function getByCategory(Request $request, $category)
    {
        $perPage = $request->get('per_page', 12);

        $posts = BlogPost::with('author:id,name')
            ->where('category', $category)
            ->where('published', true)
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return response()->json($posts);
    }
}
