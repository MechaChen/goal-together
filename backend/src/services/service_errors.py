class ValidationError(ValueError):
    pass


class NotFoundError(LookupError):
    pass


class CapacityError(RuntimeError):
    pass


class ConflictError(RuntimeError):
    pass
