<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    // GET /api/users?with_deleted=1|only_deleted=1
    public function index(Request $request)
    {
        $query = User::with(['roles:id,name', 'roles.permissions:id,name']); // eager-load roles 

        if ($request->boolean('only_deleted')) {
            $query->onlyDeletedFlag();        // only deleted=true (custom scope) 
        } elseif ($request->boolean('with_deleted')) {
            $query->withDeletedFlag();        // include deleted=true 
        }
        // default: model global scope hides deleted=true 

        $users = $query->get();

        $users->transform(function ($user) {
            $user->role_names = $user->roles?->pluck('name')->values() ?? collect();
            $user->permission_names = $user->roles
            ? $user->roles
                ->flatMap(fn($r) => $r->permissions?->pluck('name') ?? collect())
                ->unique()
                ->values()
            : collect();

            return $user;
        });

        return response()->json($users, 200);
    }

    // POST
    public function store(Request $request)
    {
        // Validate core fields + a single role name, like the sample code
        $data = $request->validate([
            'name'         => 'nullable|string|max:255',
            'email'        => 'required|string|email|max:255|unique:users',
            'password'     => 'required|string|min:6',
            'firstname'    => 'nullable|string|max:255',
            'lastname'     => 'nullable|string|max:255',
            'username'     => 'nullable|string|max:255|unique:users',
            'phone'        => 'nullable|string|max:20',
            'institution'  => 'nullable|string|max:255',
            'department'   => 'nullable|string|max:255',
            'address'      => 'nullable|string',
            'city'         => 'nullable|string|max:100',
            'country'      => 'nullable|string|max:100',
            'lang'         => 'nullable|string|max:10',
            'picture'      => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
            'profile_age'  => 'nullable|integer',
            'profile_gender'        => 'nullable|in:Male,Female,Other',
            'profile_studentid'     => 'nullable|string|max:255',
            'profile_employeeid'    => 'nullable|string|max:255',
            'profile_qualification' => 'nullable|string|max:255',
            'deleted'      => 'sometimes|boolean',
            'suspended'    => 'sometimes|boolean',

            // Single role name required (like your sample)
            'role'         => 'required|string|exists:roles,name',
        ]); // validation [9][4]

        // Optional: if you strictly use the 'api' guard, validate against it in code after
        // or replace the rule with a custom Rule::exists where('guard_name','api') if desired. [10][6]

        // Handle file upload
        if ($request->hasFile('picture')) {
            $data['picture'] = $request->file('picture')->store('users', 'public');
        }

        // Normalize booleans
        if (array_key_exists('deleted', $data)) {
            $data['deleted'] = filter_var($data['deleted'], FILTER_VALIDATE_BOOLEAN);
        }
        if (array_key_exists('suspended', $data)) {
            $data['suspended'] = filter_var($data['suspended'], FILTER_VALIDATE_BOOLEAN);
        }
        // Derive display name if not provided, to satisfy NOT NULL
        if (empty($data['name'])) {
            $full = trim(($data['firstname'] ?? '').' '.($data['lastname'] ?? ''));
            $data['name'] = $full !== '' ? $full : strtok($data['email'], '@'); // fallback [21]
        }

        // Hash password
        $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);

        // Create user
        $user = User::create($data);

        // Assign single role by name (like your sample), ensuring guard alignment
        // If you need to enforce guard='api', check that role exists for 'api' guard:
        // $roleExists = \Spatie\Permission\Models\Role::where('name',$data['role'])->where('guard_name',$user->guard_name ?? 'api')->exists();
        // if (!$roleExists) return response()->json(['message' => 'Role not found for api guard'], 422);
        $user->assignRole($data['role']); // additive single-role assignment [1]

        // Optional Passport token (kept as in your original method)
        $token = $user->createToken('passportToken')->accessToken;

        // Return with relations
        return response()->json([
            'message' => 'User created',
            'user'    => $user->load(['roles']), // add other relations if they exist on your model
            'token'   => $token,
        ], 201);
    }

    // GET /api/users/{id}?with_deleted=1
    public function show(Request $request, $id)
    {
        $query = User::with('roles:id,name');
        if ($request->boolean('with_deleted')) {
            $query->withDeletedFlag(); // include deleted rows [24]
        }

        $user = $query->findOrFail($id);
        $user->role_names = $user->roles?->pluck('name')->values() ?? collect();

        return response()->json($user, 200);
    }

    // PUT/PATCH /api/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::withDeletedFlag()->findOrFail($id); // include deleted 

        // Validate inputs, mirroring the simple “single role” structure
        $validated = $request->validate([
            'name'                  => 'sometimes|string|max:255',
            'email'                 => ['sometimes','email', Rule::unique('users','email')->ignore($user->id)], // ignore current user [4]
            'password'              => 'sometimes|string|min:6',
            'firstname'             => 'nullable|string|max:255',
            'lastname'              => 'nullable|string|max:255',
            'username'              => ['sometimes','nullable','string','max:255', Rule::unique('users','username')->ignore($user->id)],
            'phone'                 => 'nullable|string|max:20',
            'institution'           => 'nullable|string|max:255',
            'department'            => 'nullable|string|max:255',
            'address'               => 'nullable|string',
            'city'                  => 'nullable|string|max:100',
            'country'               => 'nullable|string|max:100',
            'lang'                  => 'nullable|string|max:10',
            'picture'               => 'nullable|string|max:255',
            'profile_age'           => 'nullable|integer',
            'profile_gender'        => 'nullable|in:Male,Female,Other',
            'profile_studentid'     => 'nullable|string|max:255',
            'profile_employeeid'    => 'nullable|string|max:255',
            'profile_qualification' => 'nullable|string|max:255',
            'deleted'               => 'sometimes|boolean',
            'suspended'             => 'sometimes|boolean',

            // Optional single role name; exists in roles table
            'role'                  => 'sometimes|string|exists:roles,name',
        ]); // validation [4]

        // Normalize optional booleans if they came as strings
        if ($request->has('deleted')) {
            $validated['deleted'] = filter_var($request->input('deleted'), FILTER_VALIDATE_BOOLEAN);
        }
        if ($request->has('suspended')) {
            $validated['suspended'] = filter_var($request->input('suspended'), FILTER_VALIDATE_BOOLEAN);
        }

        // Handle password update
        if (!empty($validated['password'])) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Update profile fields
        $user->update($validated);

        // If a single role was provided, replace roles with that role (sync)
        if ($request->has('role')) {
            // Optional: enforce guard alignment for API users
            $roleName = $request->input('role');
            $existsForGuard = Role::where('name', $roleName)
                ->where('guard_name', $user->guard_name ?? 'api')
                ->exists(); // guard-safe check [9]

            if (!$existsForGuard) {
                return response()->json([
                    'message' => "Role '{$roleName}' not found for guard=api.",
                ], 422);
            }

            $user->syncRoles([$roleName]); // replace roles with single role [6]
        }

        return response()->json([
            'message' => 'User updated',
            'user'    => $user->load('roles'),
        ], 200);
    }


    // DELETE /api/users/{id} — boolean flag soft delete
    public function destroy($id)
    {
        $user = User::withDeletedFlag()->findOrFail($id);
        $user->update(['deleted' => true]); // mark as deleted [24]

        return response()->json(['message' => 'User soft-flagged as deleted'], 200);
    }

    // PUT /api/users/{id}/restore-flagged — restore flagged soft delete
    public function restoreFlagged($id)
    {
        $user = User::onlyDeletedFlag()->findOrFail($id);
        $user->update(['deleted' => false]);

        return response()->json(['message' => 'User restored'], 200);
    }

    // DELETE /api/users/{id}/force — permanent removal
    public function forceDestroy($id)
    {
        $user = User::withDeletedFlag()->findOrFail($id);
        $user->delete(); // hard delete row (no SoftDeletes trait) [27]

        return response()->json(['message' => 'User permanently deleted'], 200);
    }

    // GET /api/roles — list available roles for UI (id, name) with guard_name='api'
    public function listRoles()
    {
        $roles = Role::where('guard_name', 'api')
            ->select('id','name')
            ->orderBy('name')
            ->get(); // fetch roles to assign [13]

        return response()->json($roles, 200);
    }

    // PUT /api/users/{id}/roles — replace roles by names or IDs
    public function syncUserRoles(Request $request, $id)
    {
        $user = User::withDeletedFlag()->findOrFail($id);

        $data = $request->validate([
            'roles'      => 'sometimes|array',
            'roles.*'    => 'string',
            'role_ids'   => 'sometimes|array',
            'role_ids.*' => 'integer',
        ]); // input validation [15][1]

        $names = $request->input('roles', []);
        if ($request->filled('role_ids')) {
            $idNames = Role::whereIn('id', $request->input('role_ids', []))
                ->where('guard_name', $user->guard_name ?? 'api')
                ->pluck('name')
                ->all(); // guard-correct names [13]
            $names = array_values(array_unique(array_merge($names, $idNames))); // dedupe [3]
        }

        $user->syncRoles($names); // replace with provided set [3]

        return response()->json([
            'user'  => $user->load('roles'),
            'roles' => $user->getRoleNames(),
        ], 200);
    }

    // POST /api/users/{id}/roles — add (assign) roles by name
    public function addUserRoles(Request $request, $id)
    {
        $user = User::withDeletedFlag()->findOrFail($id);

        $data = $request->validate([
            'roles'   => 'required|array|min:1',
            'roles.*' => 'string',
        ]); // role names to add [1]

        $user->assignRole($data['roles']); // additive [3]

        return response()->json([
            'user'  => $user->load('roles'),
            'roles' => $user->getRoleNames(),
        ], 200);
    }

    // DELETE /api/users/{id}/roles/{role} — remove a single role by name
    public function revokeUserRole($id, string $role)
    {
        $user = User::withDeletedFlag()->findOrFail($id);
        $user->removeRole($role); // remove by name [3]

        return response()->json([
            'user'  => $user->load('roles'),
            'roles' => $user->getRoleNames(),
        ], 200);
    }
}
