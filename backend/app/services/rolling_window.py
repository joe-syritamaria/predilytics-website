from collections import deque
from statistics import mean, pstdev


class RollingWindow:
    def __init__(self, max_size: int):
        self.max_size = max_size
        self.items = deque(maxlen=max_size)

    def add(self, item):
        self.items.append(item)

    def get_all(self):
        return list(self.items)

    def avg(self, attr_name):
        vals = [getattr(x, attr_name) for x in self.items if getattr(x, attr_name) is not None]
        return mean(vals) if vals else None

    def std(self, attr_name):
        vals = [getattr(x, attr_name) for x in self.items if getattr(x, attr_name) is not None]
        return pstdev(vals) if len(vals) >= 2 else None

    def rate_true(self, attr_name):
        vals = [getattr(x, attr_name) for x in self.items]
        if not vals:
            return 0.0
        return sum(1 for v in vals if v) / len(vals)