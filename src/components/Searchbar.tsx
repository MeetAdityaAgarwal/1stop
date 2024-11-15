import styles from "@/src/styles/searchbar.module.css";
import { Combobox, Transition } from "@headlessui/react";
import type { Product } from "@prisma/client";
import Router from "next/router";
import * as React from "react";

// external imports
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

interface SearchbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  data: TData[];
  route: string;
}

const Searchbar = <TData extends Product>({
  data,
  route,
  className,
}: SearchbarProps<TData>) => {
  const [query, setQuery] = React.useState("");

  // filter data
  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
        item.name
          ? item.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
          : item
      );

  return (
    <Combobox
      aria-label="combobox"
      as="div"
      className={`relative w-full max-w-5xl ${className}`}
      onChange={(value: TData) => {
        Router.push(`/app/${route}/${value.id}`);
      }}
    >
      <div className={styles.inputWrapper}>
        <Combobox.Input
          type="text"
          className={styles.input}
          placeholder={`Search ${route}...`}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Combobox.Button aria-label="search" className={styles.inputButton}>
          <MagnifyingGlassIcon
            className="aspect-square w-6 stroke-2 text-white"
            aria-hidden="true"
          />
        </Combobox.Button>
      </div>
      <Transition
        as={React.Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options static className={styles.options}>
          {filteredData.length === 0 && query !== "" ? (
            <div className={styles.optionNull}>
              <span>No item found</span>
            </div>
          ) : (
            filteredData.map((item) => (
              <Combobox.Option
                key={item.id}
                className={styles.option}
                value={item}
              >
                <>
                  <span>{item.name}</span>
                </>
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
};

export default Searchbar;
