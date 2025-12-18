import { selectRole } from './action'

export default function SelectRolePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Select Development Role
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Choose a role to simulate for this session.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <form action={selectRole} className="w-full">
                        <input type="hidden" name="role" value="admin" />
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Super Admin
                        </button>
                    </form>

                    <form action={selectRole} className="w-full">
                        <input type="hidden" name="role" value="partner_admin" />
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Partner Admin
                        </button>
                    </form>

                    <form action={selectRole} className="w-full">
                        <input type="hidden" name="role" value="partner" />
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Partner
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
