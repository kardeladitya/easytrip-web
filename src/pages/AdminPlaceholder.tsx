import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const AdminPlaceholder = ({ title, description }: { title: string; description: string }) => (
  <AdminLayout title={title}>
    <Card className="p-10 text-center border-0 shadow-sm">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
        <Construction className="w-8 h-8" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-500 max-w-md mx-auto">{description}</p>
    </Card>
  </AdminLayout>
);

export default AdminPlaceholder;
