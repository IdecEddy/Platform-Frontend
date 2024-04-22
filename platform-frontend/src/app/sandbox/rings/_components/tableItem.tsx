import { table } from "console";
import { Pod } from "../page";
import { formatBytesToBinary, convertNanocoresToMillicores } from "./nodeCard";
import { useState, useCallback, useEffect, useRef } from "react";
import { RefObject } from "react";
function setLimitColors(value: number) {
  let color: string;
  if (value >= 80) {
    color = "text-red-600";
  } else if (value >= 50) {
    color = "text-yellow-600";
  } else {
    color = "text-green-600";
  }
  return color;
}

const createHeaders = (headers: string[]) => {
  return headers.map((item) => ({
    text: item,
    ref: useRef<HTMLTableCellElement>(null),
  }));
};

export function ResizeableTable({
  headers,
  minCellWidth,
  tableContent,
  containerDiv
}: {
  headers: string[];
  minCellWidth: number;
  tableContent: Pod[];
  containerDiv: RefObject<HTMLDivElement>;
}) {
  
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [tableHeight, setTableHeight] = useState<string | number>("auto");
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const tableElement =  useRef<HTMLTableElement>(null);
  const columns = createHeaders(headers);

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      if (!tableElement.current) return;
      if (!window) return;
      const gridColumns = columns.map((col, i, arr) => {
        if (i === activeIndex && col.ref.current) {
          const width = e.clientX - col.ref.current.offsetLeft;
          const difference = col.ref.current.offsetWidth - width;
          console.log(arr[i + 1].ref.current.offsetWidth - difference);
          if (width >= minCellWidth) {
            return `${width}px`;
          }
        }
        return col.ref.current ? `${col.ref.current.offsetWidth}px` : `auto`;
      });
      const gridColumnsString = gridColumns;
      const gridColumnsTotal = gridColumnsString
        .map((column) => parseInt(column, 10))
        .reduce((acc, current) => acc + current, 0);
      const style = window.getComputedStyle(tableElement.current);
      if (gridColumnsTotal <= parseInt(style.maxWidth)) {
        tableElement.current.style.gridTemplateColumns = `${gridColumns.join(" ")}`;
      }
      tableElement.current.style.userSelect = "none";
      const selection = window.getSelection();
      if (selection) selection.empty();
    },
    [activeIndex, columns, minCellWidth],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!tableElement.current) return;
      setTableHeight(tableElement.current.offsetHeight);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const mouseDown = (index: number) => {
    setActiveIndex(index);
  };

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(null);
    if (!tableElement.current) return;
    tableElement.current.style.userSelect = "auto";
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, mouseMove, mouseUp, removeListeners]);

  useEffect(() => {
    const computeColumnWidths = () => {
      const table = tableElement.current;
      if (!table) return;

      const rows = table.getElementsByTagName('tr');
      let maxColumnWidths = Array(headers.length).fill(0);
      Array.from(rows).forEach(row => {
        Array.from(row.cells).forEach((cell, index) => {
          const cellWidth = cell.offsetWidth;
          if (cellWidth > (maxColumnWidths[index] ?? 0)) {
            maxColumnWidths[index] = cellWidth;
          }
        })
      })
      const total = maxColumnWidths.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0)
      if (!containerDiv.current) return;
      const remainder = containerDiv.current.offsetWidth - total;
      maxColumnWidths[maxColumnWidths.length -1] = maxColumnWidths[maxColumnWidths.length -1] + (remainder - 20);
      console.log(maxColumnWidths);
      setColumnWidths(maxColumnWidths);
    };

    if ( columnWidths.length === 0 ) {
      computeColumnWidths();
    } 
    // Optionally, you could add an event listener to handle window resizing
    window.addEventListener('resize', computeColumnWidths);
    return () => {
      window.removeEventListener('resize', computeColumnWidths);
    };
  }, [tableContent]);
  function initGridSize() {
    return columnWidths.map(size => {
      return `${size}px`;
    }).join(' ');
  }
  if (columnWidths.length === 0) {
    return ( 
      <table className="" ref={tableElement}>
        <thead>
          <tr>
            { headers.map((item, key) => (
              <th className="px-5 text-left" key={key}> {item} </th>
            ))}
          </tr>
        </thead>
        <tbody>
          { tableContent.map((item, key) => (
            <tr key={key}>
              <th className="px-5 text-left">{item._name}</th>
              <th className="px-5 text-left">{item._namespace}</th>
              <th className="px-5 text-left">{convertNanocoresToMillicores(item._cpu)}{item._cpu_limit ? "/" + convertNanocoresToMillicores(item._cpu_limit) : ""}</th>
              <th className="px-5 text-left">{formatBytesToBinary(item._memory)}{item._memory_limit ? "/" + formatBytesToBinary(item._memory_limit) : ""}</th>
            </tr>
          ))}
        </tbody>
      </table>
    )
  } else {
      return (
      <div className="mb-5 overflow-hidden">
        <table
          className="min-w-[1650px] grid w-full max-w-[1650px]  overflow-hidden"
          ref={tableElement}
          style={{"gridTemplateColumns": initGridSize() }}
        >
          <thead className="contents">
            <tr className="contents">
              {columns.map(({ ref, text }, i) => (
                <th
                  className="relative text-ellipsis whitespace-nowrap px-5 text-left"
                  key={text}
                  ref={ref}
                >
                  {text}
                  <div
                    style={{ height: tableHeight }}
                    onMouseDown={() => mouseDown(i)}
                    className={`absolute right-0 top-0 z-[1] block w-[7px] border-r-2 border-transparent hover:cursor-col-resize hover:border-[#ccc] active:border-[#517ea5] ${activeIndex === i ? "active" : "idle"}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <TableItem pods={tableContent} />
        </table>
      </div>
    );
  }
}

export default function TableItem({ pods }: { pods: Pod[] }) {
  return (
    <>
      {pods.map((pod, key) => (
        <tr className="contents" key={key}>
          <td className="block overflow-hidden text-ellipsis whitespace-nowrap border-t border-white px-5 text-left">
            {pod._name}
          </td>
          <td className="block overflow-hidden text-ellipsis whitespace-nowrap border-t border-white px-5 text-left">
            {pod._namespace}
          </td>
          <TableCPUResourceItem value={pod._cpu} limit={pod._cpu_limit} />
          <TableMemoryResourceItem
            value={pod._memory}
            limit={pod._memory_limit}
          />
        </tr>
      ))}
    </>
  );
}

function TableCPUResourceItem({
  value,
  limit,
}: {
  value: number;
  limit: number;
}) {
  if (limit <= 0) {
    return (
      <td className="block overflow-hidden text-ellipsis whitespace-nowrap border-t border-white px-5 text-left">
        {convertNanocoresToMillicores(value)}
      </td>
    );
  } else {
    const percent = Math.floor((value / limit) * 100 * 100) / 100;
    const color = setLimitColors(percent);
    return (
      <td
        className={`block overflow-hidden text-ellipsis whitespace-nowrap border-t border-white px-5 text-left ${color}`}
      >
        {convertNanocoresToMillicores(value)} /{" "}
        {convertNanocoresToMillicores(limit)} ({percent}%)
      </td>
    );
  }
}

function TableMemoryResourceItem({
  value,
  limit,
}: {
  value: number;
  limit: number;
}) {
  if (limit <= 0) {
    return (
      <td className="block overflow-hidden text-ellipsis whitespace-nowrap border-t border-white px-5 text-left">
        {formatBytesToBinary(value)}
      </td>
    );
  } else {
    const percent = Math.floor((value / limit) * 100 * 100) / 100;
    const color = setLimitColors(percent);
    return (
      <td
        className={`block overflow-hidden text-ellipsis whitespace-nowrap border-t border-white px-5 text-left ${color}`}
      >
        {formatBytesToBinary(value)} / {formatBytesToBinary(limit)} ({percent}%){" "}
      </td>
    );
  }
}
