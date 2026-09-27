"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#EEE9E1] aspect-[16/9] min-h-[650px] sm:min-h-0">

      {/* =========================
          HERO IMAGE
      ========================== */}
      <img
        src="/images/hero.jpg"
        alt="Ather Perfume"
        className="
          absolute inset-0
          w-full h-full
          object-cover
          object-[67%_center]
          sm:object-center
        "
      />

      {/* =========================
          DESKTOP LIGHT
      ========================== */}
      <div
        className="
          absolute inset-0
          hidden sm:block
          bg-gradient-to-r
          from-[#F5F1EA]/45
          via-transparent
          to-transparent
        "
      />

      {/* =========================
          MOBILE ATMOSPHERIC GRADIENT
      ========================== */}
      <div
        className="
          absolute inset-x-0 bottom-0
          h-[55%]
          sm:hidden
          bg-gradient-to-t
          from-[#EEE9E1]
          via-[#EEE9E1]/88
          via-[#EEE9E1]/50
          to-transparent
        "
      />

      {/* =========================
          CONTENT
      ========================== */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.13,
              delayChildren: 0.25,
            },
          },
        }}
        className="
          absolute inset-0

          flex
          items-end
          sm:items-center

          px-6
          sm:px-10
          lg:px-16
          xl:px-24

          pb-10
          sm:pb-0
        "
      >

        <div
          dir="rtl"
          className="
            w-full
            sm:w-[55%]
            lg:w-[48%]
            max-w-2xl

            text-right

            sm:mr-auto
            sm:ml-0
          "
        >

          {/* =========================
              SMALL LABEL
          ========================== */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 12,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="
              flex
              items-center
              justify-start

              gap-3

              mb-2
              sm:mb-4
            "
          >

            <span
              className="
                block
                w-7
                sm:w-10
                h-px
                bg-[#A88B63]
              "
            />

            <p
              className="
                text-[11px]
                sm:text-sm
                lg:text-base

                font-medium

                tracking-[0.18em]

                text-[#766757]
              "
            >
              ليس عطراً
            </p>

          </motion.div>


          {/* =========================
              MAIN TITLE
          ========================== */}
          <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
                filter: "blur(5px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1.15,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="
              font-serif
              font-medium

              text-[41px]
              leading-[1.08]

              sm:text-5xl
              lg:text-6xl
              xl:text-7xl

              tracking-[-0.025em]

              text-[#302821]
            "
          >
            بل أثر يبقى
          </motion.h1>


          {/* =========================
              GOLD ACCENT
          ========================== */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                scaleX: 0,
              },
              visible: {
                opacity: 1,
                scaleX: 1,
                transition: {
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="
              origin-right

              mt-4
              sm:mt-6

              mb-4
              sm:mb-6

              w-10
              sm:w-14

              h-[1px]

              bg-[#A88B63]
            "
          />


          {/* =========================
              DESCRIPTION
          ========================== */}
          <motion.p
            variants={{
              hidden: {
                opacity: 0,
                y: 14,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="
              max-w-[330px]
              sm:max-w-md
              lg:max-w-lg

              text-[12px]
              sm:text-sm
              lg:text-base

              leading-[1.9]
              sm:leading-7

              font-normal

              text-[#62574E]
            "
          >
            عطور فاخرة تخلّد اللحظة، وتترك في الذاكرة
            أثراً لا يُمحى. من أرقى المكونات الطبيعية.
          </motion.p>


          {/* =========================
              BUTTONS
          ========================== */}
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 15,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="
              mt-7
              sm:mt-9
              lg:mt-10

              flex
              items-center

              gap-2.5
              sm:gap-3
            "
          >

            {/* PRIMARY */}
            <Link
              href="/collections"
              className="
                group

                h-11
                sm:h-12

                min-w-[132px]
                sm:min-w-[155px]

                inline-flex
                items-center
                justify-center

                rounded-full

                bg-[#302821]

                px-5

                text-[10px]
                sm:text-xs

                font-medium

                tracking-[0.04em]

                text-[#F8F4ED]

                shadow-[0_10px_30px_rgba(48,40,33,0.13)]

                transition-all
                duration-500
                ease-out

                hover:-translate-y-1
                hover:bg-[#A88B63]

                active:scale-[0.98]
              "
            >
              استكشف المجموعة
            </Link>


            {/* SECONDARY */}
            <Link
              href="/about"
              className="
                group

                h-11
                sm:h-12

                min-w-[92px]
                sm:min-w-[110px]

                inline-flex
                items-center
                justify-center

                rounded-full

                border
                border-[#75685B]/45

                bg-[#F8F4ED]/25

                backdrop-blur-md

                px-5

                text-[10px]
                sm:text-xs

                font-medium

                tracking-[0.04em]

                text-[#302821]

                transition-all
                duration-500
                ease-out

                hover:-translate-y-1
                hover:bg-[#302821]
                hover:text-[#F8F4ED]
                hover:border-[#302821]

                active:scale-[0.98]
              "
            >
              قصتنا
            </Link>

          </motion.div>

        </div>
      </motion.div>

    </section>
  );
}