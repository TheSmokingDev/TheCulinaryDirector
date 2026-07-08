import { Alert, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { useTools } from "../hooks/useTools";
import { useAuth } from "../auth/AuthProvider";
import BrandButton from "../components/BrandButton";
import Hero from "../components/Hero";
import PageLayout from "../components/PageLayout";
import SectionHeading from "../components/SectionHeading";
import ToolCard from "../components/ToolCard";

export default function ToolsHomePage() {
  const { data: tools, isLoading, error } = useTools();
  const { isAuthenticated } = useAuth();

  return (
    <PageLayout>
      <Hero
        title={
          <>
            Tools to transform
            <br />
            your kitchen
          </>
        }
        subtitle="Free calculators and planners built on the systems we teach in our workshops — so you can control food cost, hold standards and develop your team."
        actions={
          <>
            <a href="#tools">
              <BrandButton>Explore the tools</BrandButton>
            </a>
            {!isAuthenticated && (
              <Link to="/register">
                <BrandButton variantStyle="outline">
                  Create a free account
                </BrandButton>
              </Link>
            )}
          </>
        }
      />

      <section id="tools" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          kicker="Our tools"
          title="Built for working kitchens"
          subtitle="Sign in with a free account to use any available tool. More are on the way."
        />

        {error && (
          <Alert
            type="error"
            showIcon
            message="Couldn't load the tools"
            description="Make sure the backend is running on http://localhost:8000."
          />
        )}

        {isLoading && <Skeleton active paragraph={{ rows: 6 }} />}

        {tools &&
          [...new Set(tools.map((t) => t.category))].map((category) => (
            <div key={category} className="mb-14">
              <h3 className="brand-label mb-6 border-b border-sand pb-3 text-xs text-maroon">
                {category}
              </h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter((t) => t.category === category)
                  .map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
              </div>
            </div>
          ))}
      </section>

      <section className="border-y border-sand bg-cream-light">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <SectionHeading
            align="center"
            kicker="Go further"
            title="Want the thinking behind the tools?"
            subtitle="Our workshops and courses teach the food costing, profit and leadership systems these tools are built on."
          />
          <a href="https://www.theculinarygroup.com.au/the-culinary-director/workshops-courses">
            <BrandButton>View workshops &amp; courses</BrandButton>
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
