import { customElement, noShadowDOM } from "solid-element";
import { createSignal } from "solid-js";
import "../app.css";

export const CounterExtension = customElement(
  "solid-counter",
  { backgroundColor: "white", color: "black", rounded: "false" },
  (props, { element }) => {
    noShadowDOM();

    const { backgroundColor, color, rounded } = props;
    const [count, setCount] = createSignal(0);

    console.log({ props, element });

    return (
      <div
        style={{
          "background-color": backgroundColor,
          color: color,
          "border-radius": rounded === "true" ? "1rem" : "0",
        }}
        class="p-4 shadow-md"
        role="banner"
      >
        <h2 class="bg-green-500">Shopify Theme App Extension with SolidJs</h2>
        <p>
          This is a simple counter component that is rendered as a custom
          element.
        </p>

        <div class="h-10 w-32">
          <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
            <button
              onClick={() => setCount((prev) => prev - 1)}
              class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
            >
              <span class="m-auto text-2xl font-thin">−</span>
            </button>
            <span class="flex-1 focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 outline-none">
              {count()}
            </span>
            <button
              onClick={() => setCount((prev) => prev + 1)}
              class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
            >
              <span class="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
);
