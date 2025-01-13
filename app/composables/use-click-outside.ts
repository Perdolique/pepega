interface Params {
  ignore?: Ref<HTMLElement | null>[];
}

export function useClickOutside(watchValue: Ref<boolean>, callback: () => void, params: Params) {
  function onClickOutside(event: MouseEvent) {
    const { ignore } = params
    const composedPath = event.composedPath()

    const hasIgnoredElement = ignore?.some((element) => {
      return element.value !== null && composedPath.includes(element.value)
    })

    if (hasIgnoredElement) {
      return
    }

    callback()
  }

  watch(watchValue, (newValue, _, onCleanup) => {
    if (newValue) {
      document.addEventListener('click', onClickOutside, {
        capture: true,
        passive: true
      })
    } else {
      document.removeEventListener('click', onClickOutside, {
        capture: true
      })
    }

    onCleanup(() => {
      document.removeEventListener('click', onClickOutside, {
        capture: true
      })
    })
  })
}
