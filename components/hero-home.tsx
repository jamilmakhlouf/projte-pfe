import Link from "next/link";
import VideoThumb from "@/public/images/hero-image-01.jpg";
import ModalVideo from "@/components/modal-video";

export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Welcome to StageEase 🚀
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Our application is designed to seamlessly connect students with companies for internships, making the process easier and more efficient.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                {/* زر تسجيل الدخول */}
                <div data-aos="fade-up" data-aos-delay={400}>
                  <Link href="/signin">
                    <button className="btn group mb-4 w-full bg-indigo-600 text-white sm:mb-0 sm:w-auto">
                      Sign In
                    </button>
                  </Link>
                </div>
                {/* زر إنشاء حساب */}
                <div data-aos="fade-up" data-aos-delay={600}>
                  <Link href="/signup">
                    <button className="btn w-full bg-green-600 text-white sm:ml-4 sm:w-auto">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <ModalVideo
            thumb={VideoThumb}
            thumbWidth={1104}
            thumbHeight={576}
            thumbAlt="Modal video thumbnail"
            video="videos/video.mp4"
            videoWidth={1920}
            videoHeight={1080}
          />
        </div>
      </div>
    </section>
  );
}
