import { Users, User, ShoppingBag, Trophy, Calendar, Target } from "lucide-react";

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Group Coaching",
    description: "Learn with peers in dynamic group sessions led by certified coaches.",
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
    title: "Private Coaching",
    description: "One-on-one personalized training sessions for rapid skill development.",
  },
  {
    icon: <ShoppingBag className="h-8 w-8 text-primary" />,
    title: "Equipment Store",
    description: "Premium rackets, shuttlecocks, and gear from top brands.",
  },
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Innovative Lessons",
    description: "Advanced training methods using technology and analytics.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Court Rental",
    description: "Book premium courts by the hour with flexible scheduling.",
  },
  {
    icon: <Trophy className="h-8 w-8 text-primary" />,
    title: "Tournaments",
    description: "Regular competitions and leagues for all skill levels.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Badminton Excellence
          </h2>
          <p className="text-lg text-muted-foreground">
            From beginner lessons to professional training, we provide comprehensive services for all levels.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <a
                href="#"
                className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;