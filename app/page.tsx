import { clientConfig } from "@/config/client";
import { RevenueDashboardWidget } from "@/widgets/revenue/RevenueDashboardWidget";

export default function Home() {
  return (
    <RevenueDashboardWidget
      companyName={clientConfig.company.name}
      currency={clientConfig.company.currency}
      locale={clientConfig.company.locale}
    />
  );
}
