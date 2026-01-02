import { Sparkles, Package, Zap, Heart, Award, Palette } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">About Us</span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to StickerCraft
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your one-stop e-commerce destination for custom stickers and keychains, 
            powered by cutting-edge AI technology
          </p>
        </div>

        {/* What We Do */}
        <div className="glass bg-card rounded-3xl p-8 md:p-12 mb-12 border border-border">
          <h2 className="text-3xl font-bold mb-6 text-center">What We Do</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed">
              StickerCraft is a modern e-commerce platform specializing in <strong className="text-foreground">custom stickers and keychains</strong>. 
              We combine traditional designs with innovative <strong className="text-foreground">AI-powered generation</strong> to give you 
              endless creative possibilities.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Whether you're looking for your favorite anime characters, Minecraft designs, minimalist aesthetics, 
              or something completely unique, we've got you covered. Our platform lets you create, customize, 
              and order exactly what you envision!
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="group glass bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Generation</h3>
            <p className="text-muted-foreground">
              Create unique, one-of-a-kind stickers using our advanced AI technology. Just describe what you want!
            </p>
          </div>

          <div className="group glass bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Custom Design</h3>
            <p className="text-muted-foreground">
              Upload your own images, add text, choose shapes, and personalize every detail to match your style.
            </p>
          </div>

          <div className="group glass bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p className="text-muted-foreground">
              Browse hundreds of pre-made designs including anime, gaming, food, and minimalist categories.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-8 md:p-12 mb-12 border-2 border-primary/20">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose StickerCraft?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Fast & Reliable</h3>
                <p className="text-muted-foreground">
                  Quick delivery across India with premium members getting priority shipping in 3-5 days.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Quality Materials</h3>
                <p className="text-muted-foreground">
                  Premium quality stickers and keychains with vibrant colors and durable construction.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Loyalty Rewards</h3>
                <p className="text-muted-foreground">
                  Earn points with every purchase and unlock exclusive rewards, discounts, and free items.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Fun Experience</h3>
                <p className="text-muted-foreground">
                  Enjoy gamified features like Lucky Spin, Scratch Cards, Mystery Boxes, and Personality Quizzes!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-gradient-to-r from-primary to-purple-600 text-white rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-95">
            To make personalized, high-quality stickers and keychains accessible to everyone through 
            innovative technology and creative design. We believe everyone should have the tools to 
            express their unique personality and style!
          </p>
        </div>
      </div>
    </div>
  );
}
